import type { MonorepoTemplateData } from "../../../../types";

export function generateRoutesIndexTsx(data: MonorepoTemplateData): string {
  return `import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCounter, increment, decrement, reset } from "@/lib/counter-store";
import { env } from "${data.scope}/env/client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

function HomeComponent() {
  const count = useCounter();

  const { data: helloData, isLoading: helloLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await fetch(env.VITE_API_URL + "/hello");
      if (!res.ok) throw new Error("Failed to fetch /hello");
      return res.json() as Promise<{ message: string }>;
    },
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Hello API (TanStack Query)</h2>
          {helloLoading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <p className="text-sm text-muted-foreground">{helloData?.message}</p>
          )}
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Counter (TanStack Store)</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={decrement}>−</Button>
            <span className="w-12 text-center text-lg font-semibold tabular-nums">{count}</span>
            <Button variant="outline" size="sm" onClick={increment}>+</Button>
            <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
`;
}
