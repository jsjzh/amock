import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
// import "./shims.axios.d.ts";

export const mockRequestInterceptors = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const myURL = new URL(config.url || "/");

  // console.log(myURL);
  // console.log(myURL.pathname);

  return {
    ...config,
    method: "get",
    url: myURL.pathname + myURL.search,
    mockConfig: {
      enabled: true,
      timeout: 200,
    },
  };
};

export const mockResponseInterceptors = (data: AxiosResponse) => {
  console.log(data);

  if (!data.config.mockConfig?.enabled) return data;
  else {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        data.data = data.config.mockData && data.config.mockData("{}", "{}");
        resolve(data);
      }, data.config.mockConfig?.timeout || 200);
    });
  }
};

axios.interceptors.request.use(mockRequestInterceptors);
axios.interceptors.response.use(mockResponseInterceptors);

(async () => {
  const data = await axios.get<{ name: string }>(
    "http://www.baidu.com",
    {
      params: { name: "string" },
      mockData: () => {
        name: "king";
      },
    },
    // {
    //   mockData: (query, data) => {
    //     console.log(query);
    //     console.log(query);
    //   },
    // },
  );

  console.log(data.data);
})();
