/**
 * Next.js App Component
 * Root application wrapper with global layout and theme support
 */

import AuthGuard from "@/components/common/AuthGuard";
import AppLayout from "@/components/common/Layout/Layout";
import reduxStore from "@/redux/store";
import "@/styles/antd-overrides.css";
import "@/styles/variables.css";
import ThemeProvider from "@/theme/ThemeProvider";
import { injectStore } from "@/utils/axiosMiddleware";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { LanguageProvider } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import "../../styles/App.css";

injectStore(reduxStore);

const onExperimentViewed = (experiment, result) => {
  const experimentId = experiment.key;
  const variationId = result.key;
};

const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-YRpkBjYFDdbpNRCo",
  enableDevMode: true,
  trackingCallback: onExperimentViewed,
});

function updateGrowthBookURL() {
  gb.setURL(window.location.href);
}

const App = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  const getLayout =
    Component.getLayout || ((page) => <AppLayout>{page}</AppLayout>);

  useEffect(() => {
    (async () => {
      await gb.loadFeatures({ autoRefresh: true });
    })();
    gb.setAttributes({ id: "123" });
    router.events.on("routeChangeComplete", updateGrowthBookURL);

    return () => router.events.off("routeChangeComplete", updateGrowthBookURL);
  }, [router.events]);

  return (
    <GrowthBookProvider growthbook={gb}>
      <Provider store={reduxStore}>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <ThemeProvider>
              <AuthGuard>
                {getLayout(<Component {...pageProps} />)}
                </AuthGuard>
            </ThemeProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </Provider>
    </GrowthBookProvider>
  );
};

export default App;
