import React from 'react';
import { CloudFog, CloudRain, Sun } from 'lucide-react';
import { WindowFrame } from './WindowFrame';
import { Cloud3DIllustration, FluentSystemIcon } from './FluentIcons';
import { ForecastDay, LanguageId, UI_TEXT, WEATHER_DATA, WindowId } from '../data/desktopData';

import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';

interface WeatherWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
}

const ForecastIcon: React.FC<{ condition: ForecastDay['condition'] }> = ({ condition }) => {
  switch (condition) {
    case 'sunny':
      return <Sun size={16} className="text-amber-500" />;
    case 'rain':
      return <CloudRain size={16} className="text-sky-600 dark:text-sky-400" />;
    case 'fog':
      return <CloudFog size={16} className="text-slate-500 dark:text-slate-400" />;
  }
};

export const WeatherWindow: React.FC<WeatherWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  language,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
}) => {
  const title = UI_TEXT[language].weather.windowTitle;

  return (
    <WindowFrame
      id="weather"
      title={title}
      icon={<FluentSystemIcon type="weather" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={460}
      height={400}
      showMaximize={false}
      initialOffset={{ x: -30, y: -20 }}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Left column info */}
        <div className="relative z-10 flex flex-col px-7 pt-5 sm:px-9 sm:pt-6">
          <div className="font-play text-[1.25rem] font-bold leading-snug opacity-85 tabular-nums">
            <div>{WEATHER_DATA.high[language]}</div>
            <div>{WEATHER_DATA.low[language]}</div>
          </div>

          <div className="mt-1.5 text-sm font-medium opacity-80">{WEATHER_DATA.location}</div>

          <div className="mt-6 flex flex-col gap-2.5">
            {WEATHER_DATA.forecast.map((item) => (
              <div
                key={item.label.en}
                className="win-card flex w-[186px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium tabular-nums"
              >
                <span>{item.label[language]}</span>
                <ForecastIcon condition={item.condition} />
              </div>
            ))}
          </div>
        </div>

        {/* Right temperature readout */}
        <div className="pointer-events-none absolute top-4 right-6 z-10 text-right opacity-90 sm:right-8">
          <div className="font-play text-[3.5rem] font-bold leading-none tracking-tight tabular-nums sm:text-[4.1rem]">
            {WEATHER_DATA.currentTemp}
          </div>
          <div className="font-play mt-2 text-xl font-normal opacity-85">
            {WEATHER_DATA.condition[language]}
          </div>
        </div>

        {/* Floating 3D Cloud Illustration */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 z-0 w-[290px] opacity-95 sm:w-[330px]">
          <Cloud3DIllustration className="h-auto w-full" />
        </div>
      </div>
    </WindowFrame>
  );
};
