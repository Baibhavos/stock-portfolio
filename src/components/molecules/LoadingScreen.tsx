import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingScreen() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center lg:flex-row gap-6">
                <div className="w-full lg:w-[20vw] shrink-0 min-w-[10vw] space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>

                <Card className="w-full lg:w-[calc(100%-20vw)]">
                    <CardHeader>
                        <CardTitle>
                            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex overflow-x-auto gap-4 pb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="min-w-[10vw] h-32 bg-muted animate-pulse rounded-lg shrink-0"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="h-12 bg-muted animate-pulse rounded-lg" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        </div>
    );
}