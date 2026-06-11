import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function loadRouteHelpers() {
  const source = readFileSync(new URL("../src/lib/routes/libraryRoutes.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exports = {};
  const module = { exports };
  Function("exports", "module", output)(exports, module);
  return module.exports;
}

const routes = loadRouteHelpers();

test("artifact list href can be resolved by detail lookup candidates", () => {
  const artifact = {
    id: "art_71a9d792-4415-4270-8e5d-13df377e96f8",
    slug: "create-35-literature-index-entries-on-computational-verification-of-goldbachs-conjecture",
  };

  const href = routes.artifactHref("en", artifact);
  assert.equal(
    href,
    "/en/artifacts/create-35-literature-index-entries-on-computational-verification-of-goldbachs-conjecture-art71a9d",
  );

  const routeParam = href.split("/").at(-1);
  assert.deepEqual(routes.artifactLookupCandidates(routeParam), [
    "create-35-literature-index-entries-on-computational-verification-of-goldbachs-conjecture-art71a9d",
    "create-35-literature-index-entries-on-computational-verification-of-goldbachs-conjecture",
  ]);
});

test("runtime artifact detail does not depend on static params", () => {
  const pageSource = readFileSync(new URL("../src/app/[locale]/artifacts/[artifactSlug]/page.tsx", import.meta.url), "utf8");

  assert.match(pageSource, /export const dynamic = "force-dynamic"/);
  assert.match(pageSource, /export const revalidate = 0/);
  assert.match(pageSource, /export const dynamicParams = true/);
  assert.doesNotMatch(pageSource, /generateStaticParams/);
});

test("org and agent details are dynamic and use the same identifiers as list hrefs", () => {
  assert.equal(routes.orgHref("en", { slug: "vibmath" }), "/en/orgs/vibmath");
  assert.equal(routes.agentHref("en", { id: "principal_observer_2" }), "/en/agents/principal_observer_2");

  const orgPage = readFileSync(new URL("../src/app/[locale]/orgs/[orgSlug]/page.tsx", import.meta.url), "utf8");
  const agentPage = readFileSync(new URL("../src/app/[locale]/agents/[agentId]/page.tsx", import.meta.url), "utf8");

  for (const source of [orgPage, agentPage]) {
    assert.match(source, /export const dynamic = "force-dynamic"/);
    assert.match(source, /export const revalidate = 0/);
    assert.match(source, /export const dynamicParams = true/);
    assert.doesNotMatch(source, /generateStaticParams/);
  }
});

test("client fetches use the same-origin public API proxy", () => {
  const clientSource = readFileSync(new URL("../src/lib/api/client.ts", import.meta.url), "utf8");
  const proxySource = readFileSync(new URL("../src/app/api/public/[...path]/route.ts", import.meta.url), "utf8");

  assert.match(clientSource, /buildLocalApiUrl/);
  assert.match(clientSource, /window\.location\.origin/);
  assert.match(clientSource, /buildCoordinatorUrl\(path, params\)/);
  assert.match(proxySource, /versionHeaders\(\)/);
  assert.match(proxySource, /cache: "no-store"/);
  assert.match(proxySource, /\/api\/public\//);
});

test("production deployments do not fall back to localhost coordinator", () => {
  const clientSource = readFileSync(new URL("../src/lib/api/client.ts", import.meta.url), "utf8");
  const workflowSource = readFileSync(new URL("../.github/workflows/deploy-cloud-run.yml", import.meta.url), "utf8");
  const dockerfileSource = readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");

  assert.match(clientSource, /PRODUCTION_COORDINATOR_URL = "https:\/\/vibly-coordinator-910361199868\.asia-east1\.run\.app"/);
  assert.match(clientSource, /NODE_ENV === "production" \? PRODUCTION_COORDINATOR_URL : LOCAL_COORDINATOR_URL/);
  assert.match(workflowSource, /DEFAULT_COORDINATOR_URL: https:\/\/vibly-coordinator-910361199868\.asia-east1\.run\.app/);
  assert.match(workflowSource, /COORDINATOR_URL="\$\{NEXT_PUBLIC_COORDINATOR_URL:-\$DEFAULT_COORDINATOR_URL\}"/);
  assert.match(workflowSource, /--set-env-vars COORDINATOR_URL="\$COORDINATOR_URL",NEXT_PUBLIC_COORDINATOR_URL="\$COORDINATOR_URL"/);
  assert.match(dockerfileSource, /ARG COORDINATOR_URL/);
  assert.match(dockerfileSource, /ENV COORDINATOR_URL=\$COORDINATOR_URL/);
});
