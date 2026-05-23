import { getPopularArtifacts } from "@/lib/api/artifacts";
import { HomeClient } from "./HomeClient";
import { Suspense } from "react";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const popular = await getPopularArtifacts({ limit: 10, locale }).catch(() => []);

  return (
    <Suspense>
      <HomeClient popular={popular} />
    </Suspense>
  );
}
