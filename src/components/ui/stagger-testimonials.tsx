"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "My favorite solution in the market. We work 5x faster with 8thSense.",
    by: "Alex, CEO at TechCorp",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    tempId: 1,
    testimonial: "I'm confident my visual content is top-tier with 8thSense. I can't say that about other studios.",
    by: "Dan, CTO at SecureNet",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  },
  {
    tempId: 2,
    testimonial: "I know it's cliche, but we were lost before we found 8thSense. Can't thank you guys enough!",
    by: "Stephanie, COO at InnovateCo",
    imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  {
    tempId: 3,
    testimonial: "8thSense's visual productions make marketing our products seamless. Can't recommend them enough!",
    by: "Marie, CFO at FuturePlanning",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12.",
    by: "Andre, Head of Design at CreativeSolutions",
    imgSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! You've saved our campaign.",
    by: "Jeremy, Product Manager at TimeWise",
    imgSrc: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we're on 8thSense, we're never going back.",
    by: "Pam, Marketing Director at BrandBuilders",
    imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop"
  },
  {
    tempId: 7,
    testimonial: "I would be lost without 8thSense's cinematic direction. The ROI is EASILY 100X for us.",
    by: "Daniel, Data Scientist at AnalyticsPro",
    imgSrc: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop"
  },
  {
    tempId: 8,
    testimonial: "It's just the best. Period.",
    by: "Fernando, UX Designer at UserFirst",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
  },
  {
    tempId: 9,
    testimonial: "I switched 5 years ago and never looked back.",
    by: "Andy, DevOps Engineer at CloudMasters",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for a visual partner like 8thSense for YEARS. So glad I finally found one!",
    by: "Pete, Sales Director at RevenueRockets",
    imgSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop"
  },
  {
    tempId: 11,
    testimonial: "It's so simple and intuitive, we got the team up to speed in 10 minutes.",
    by: "Marina, HR Manager at TalentForge",
    imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
  },
  {
    tempId: 12,
    testimonial: "8thSense's customer support is unparalleled. They're always there when we need them.",
    by: "Olivia, Customer Success Manager at ClientCare",
    imgSrc: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop"
  },
  {
    tempId: 13,
    testimonial: "The quality improvements we've seen since partnering with 8thSense are off the charts!",
    by: "Raj, Operations Manager at StreamlineSolutions",
    imgSrc: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop"
  },
  {
    tempId: 14,
    testimonial: "8thSense has revolutionized how we handle our brand aesthetics. It's a game-changer!",
    by: "Lila, Workflow Specialist at ProcessPro",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop"
  },
  {
    tempId: 15,
    testimonial: "The aesthetic scaling of 8thSense's work is impressive. It grows with our business seamlessly.",
    by: "Trevor, Scaling Officer at GrowthGurus",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    tempId: 16,
    testimonial: "I appreciate how 8thSense continually innovates their shooting styles. They're always one step ahead.",
    by: "Naomi, Innovation Lead at FutureTech",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  },
  {
    tempId: 17,
    testimonial: "The ROI we've seen with 8thSense's campaigns is incredible. It's paid for itself many times over.",
    by: "Victor, Finance Analyst at ProfitPeak",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
  },
  {
    tempId: 18,
    testimonial: "8thSense's portfolio is so robust, yet elegant. It's the perfect balance.",
    by: "Yuki, Tech Lead at BalancedTech",
    imgSrc: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop"
  },
  {
    tempId: 19,
    testimonial: "We've tried many studios, but 8thSense stands out in terms of reliability and quality.",
    by: "Zoe, Performance Manager at ReliableSystems",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-slate-900 text-white border-slate-900" 
          : "z-0 bg-white text-slate-900 border-slate-200 hover:border-slate-400"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px #e2e8f0" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-slate-200"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-slate-100 object-cover object-top rounded"
        style={{
          boxShadow: isCenter ? "3px 3px 0px #0f172a" : "3px 3px 0px #ffffff"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium leading-relaxed",
        isCenter ? "text-white" : "text-slate-900"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-slate-300" : "text-slate-500"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-white py-16"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-full",
            "bg-white border-2 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-full",
            "bg-white border-2 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
