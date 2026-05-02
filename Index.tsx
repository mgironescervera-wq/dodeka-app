import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { transformSeries } from '@/utils/music';
import LanguageSelector from '@/components/dodeka/LanguageSelector';
import NoteSelector from '@/components/dodeka/NoteSelector';
import SeriesView from '@/components/dodeka/SeriesView';
import TransformOptions from '@/components/dodeka/TransformOptions';
import FinalOptions from '@/components/dodeka/FinalOptions';

type Screen = 'language' | 'notes' | 'original' | 'transform' | 'result' | 'final';

const DodekaApp = () => {
  const [screen, setScreen] = useState<Screen>('language');
  const [originalSeries, setOriginalSeries] = useState<number[]>([]);
  const [resultSeries, setResultSeries] = useState<number[]>([]);
  const [lastSemitones, setLastSemitones] = useState(0);
  const [lastInverted, setLastInverted] = useState(false);

  const handleLanguageSelected = () => setScreen('notes');

  const handleNotesComplete = (series: number[]) => {
    setOriginalSeries(series);
    setScreen('original');
  };

  const handleContinueFromOriginal = () => setScreen('transform');

  const handleApplyTransform = (semitones: number, invert: boolean) => {
    const result = transformSeries(originalSeries, semitones, invert);
    setResultSeries(result);
    setLastSemitones(semitones);
    setLastInverted(invert);
    setScreen('result');
  };

  const handleContinueFromResult = () => setScreen('final');

  const handleAnotherTransform = () => setScreen('transform');

  const handleNewSeries = () => {
    setOriginalSeries([]);
    setResultSeries([]);
    setLastSemitones(0);
    setLastInverted(false);
    setScreen('notes');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {screen === 'language' && (
            <LanguageSelector onSelected={handleLanguageSelected} />
          )}
          {screen === 'notes' && (
            <NoteSelector onComplete={handleNotesComplete} />
          )}
          {screen === 'original' && (
            <SeriesView
              series={originalSeries}
              semitones={0}
              isInverted={false}
              isOriginal
              onContinue={handleContinueFromOriginal}
            />
          )}
          {screen === 'transform' && (
            <TransformOptions onApply={handleApplyTransform} />
          )}
          {screen === 'result' && (
            <SeriesView
              series={resultSeries}
              semitones={lastSemitones}
              isInverted={lastInverted}
              onContinue={handleContinueFromResult}
            />
          )}
          {screen === 'final' && (
            <FinalOptions
              onAnotherTransform={handleAnotherTransform}
              onNewSeries={handleNewSeries}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Index = () => (
  <LanguageProvider>
    <DodekaApp />
  </LanguageProvider>
);

export default Index;