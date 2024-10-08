import { cn } from "../lib";
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer/Footer'), {
  ssr: false
});

export default function Home() {
  return (
    <div className={cn("h-[83.2vh] w-full flex items-center justify-center")}>
      <div className={cn("h-[25vh] flex flex-col items-center text-center")}>
        <h1
          className={cn(
            "scroll-m-20 text-xl md:text-3xl font-extrabold tracking-tight w-[25ch]"
          )}
        >
          {"Your Play, Your Way: Effortless Game Planning with ha'uki"}
        </h1>
        <blockquote className={cn("mt-6 border-l-2 pl-6 italic")}>
          Where Every Game Finds Its Perfect Moment!
        </blockquote>
      </div>
      <Footer />
    </div>
  );
}
