import React from 'react';
import { cn } from '@/lib/utils';

interface ClinLogoProps {
  className?: string;
  imageClassName?: string;
}

const ClinLogo: React.FC<ClinLogoProps> = ({ className, imageClassName }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <img src="/api-saude.png" alt="API Saúde logo" className={cn("h-10 w-auto max-lg:mt-[14px]", imageClassName)} style={{ margin: "0 -2px 20px 0" }} />
      <span className="sr-only">API Saúde</span>
    </div>
  );
};

export default ClinLogo;
