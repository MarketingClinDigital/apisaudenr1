import React from "react";
import {
  ComponentRenderData,
  PlasmicComponent,
  PlasmicRootProvider,
} from "@plasmicapp/loader-react";
import { PLASMIC } from "@/plasmic-init";

interface PlasmicPageProps {
  pagePath: string;
  className?: string;
  fallback?: React.ReactNode;
  notFound?: React.ReactNode;
}

/**
 * Lightweight client-side loader for rendering Plasmic pages inside our Vite app.
 */
const PlasmicPage: React.FC<PlasmicPageProps> = ({
  pagePath,
  className,
  fallback = (
    <div className="py-12 text-center text-sm text-muted-foreground">
      Carregando interface...
    </div>
  ),
  notFound = (
    <div className="py-12 text-center text-sm text-destructive">
      Conteúdo não encontrado.
    </div>
  ),
}) => {
  const [plasmicData, setPlasmicData] =
    React.useState<ComponentRenderData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setPlasmicData(null);

      try {
        const data = await PLASMIC.maybeFetchComponentData(pagePath);
        if (!cancelled) {
          setPlasmicData(data ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            `[Plasmic] Falha ao carregar a página ${pagePath}:`,
            error
          );
          setPlasmicData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [pagePath]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <>{notFound}</>;
  }

  const pageMeta = plasmicData.entryCompMetas[0];

  return (
    <div className={className}>
      <PlasmicRootProvider
        loader={PLASMIC}
        prefetchedData={plasmicData}
        pageRoute={pageMeta.path}
        pageParams={pageMeta.params}
      >
        <PlasmicComponent component={pageMeta.displayName} />
      </PlasmicRootProvider>
    </div>
  );
};

export default PlasmicPage;
