import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/Dmitry-Antonov-Resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Dmitry-Antonov-Resume.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
