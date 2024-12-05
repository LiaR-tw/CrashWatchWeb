import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
            src="https://mapsplatform.huawei.com/js/v2/maps.js?key=DQEDAKe3wZhrbDF7lq1a7huHakObe5IQxJWrjsiEjIrojILmSSdFZUlxo9OOLGMWs+Vbl4URVo5NVrM3ARrOZwrQJ9q5bX42fhgltw=="
            async
            defer
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
