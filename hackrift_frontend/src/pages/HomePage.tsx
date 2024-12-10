import { AppSidebar } from "@/components/AppSideBar";
import AppLoader from "@/components/AppLoader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Home() {
  return (
    <AppLoader>
      <SidebarProvider>
        <div className="flex w-screen h-screen">
          <AppSidebar />
          <div className="flex-1">
            <SidebarTrigger className="m-5 w-10 h-10 bg-black text-white" />
            <main className="p-6 w-full">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl -mb-2">
                      Number of Registered Phone Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-7xl font-semibold">
                    5
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl -mb-2">
                      Number of Suspicion Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-7xl font-semibold">
                    10
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl -mb-2">
                      Number of Phone Numbers for Reverification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-7xl font-semibold">
                    1/5
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl -mb-2">
                      Days Left to Reverify
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-7xl font-semibold">
                    0 Days
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AppLoader>
  );
}

export default Home;
