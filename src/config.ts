interface Config {
  apiUrl: string;
  appName: string;
}


const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "",
};

export default config;
