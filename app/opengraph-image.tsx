import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col justify-between p-14 bg-[#f3f6ff] text-[#14171a]">
        <div tw="flex flex-col gap-3">
          <div tw="flex items-center gap-2 text-[22px] font-bold text-[#3a5166]">
            <div tw="w-3 h-3 rounded-full bg-[#5b8def]" />
            tianli0.top
          </div>
          <div tw="text-[88px] font-extrabold leading-none">Tianli</div>
          <div tw="text-[30px] leading-[1.35] text-[#2f3a44]">
            Full-time student, part-time developer.
          </div>
        </div>

        <div tw="flex items-center justify-between">
          <div tw="flex items-center gap-2 text-[22px] text-[#43515e]">
            <span>CN</span>
            <span>EN</span>
            <span>ES</span>
          </div>
          <div tw="text-[22px] text-[#43515e]">Undergraduate · Front-end · Back-end</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
