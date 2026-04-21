import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Puzzle,
  Type
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface SentenceTask {
  id: number;
  correctWords: string[];
  translation: string;
  verb: 'hablar' | 'comer' | 'vivir';
}

// --- Data: 15-20 Simple Sentences ---

const SENTENCES: SentenceTask[] = [
  { id: 1, correctWords: ["Yo", "hablo", "español"], translation: "Ես խոսում եմ իսպաներեն:", verb: 'hablar' },
  { id: 2, correctWords: ["Tú", "comes", "pan"], translation: "Դու հաց ես ուտում:", verb: 'comer' },
  { id: 3, correctWords: ["Él", "vive", "en", "Madrid"], translation: "Նա ապրում է Մադրիդում:", verb: 'vivir' },
  { id: 4, correctWords: ["Nosotros", "hablamos", "mucho"], translation: "Մենք շատ ենք խոսում:", verb: 'hablar' },
  { id: 5, correctWords: ["Ellos", "comen", "verduras"], translation: "Նրանք բանջարեղեն են ուտում:", verb: 'comer' },
  { id: 6, correctWords: ["Yo", "vivo", "aquí"], translation: "Ես այստեղ եմ ապրում:", verb: 'vivir' },
  { id: 7, correctWords: ["Ella", "habla", "italiano"], translation: "Նա խոսում է իտալերեն:", verb: 'hablar' },
  { id: 8, correctWords: ["Nosotros", "comemos", "fruta"], translation: "Մենք միրգ ենք ուտում:", verb: 'comer' },
  { id: 9, correctWords: ["Ustedes", "viven", "bien"], translation: "Դուք լավ եք ապրում:", verb: 'vivir' },
  { id: 10, correctWords: ["Yo", "como", "manzana"], translation: "Ես խնձոր եմ ուտում:", verb: 'comer' },
  { id: 11, correctWords: ["Tú", "vives", "lejos"], translation: "Դու հեռու ես ապրում:", verb: 'vivir' },
  { id: 12, correctWords: ["Ellos", "hablan", "fuerte"], translation: "Նրանք բարձր են խոսում:", verb: 'hablar' },
  { id: 13, correctWords: ["Ella", "come", "poco"], translation: "Նա քիչ է ուտում:", verb: 'comer' },
  { id: 14, correctWords: ["Nosotros", "vivimos", "juntos"], translation: "Մենք միասին ենք ապրում:", verb: 'vivir' },
  { id: 15, correctWords: ["Yo", "hablo", "poco"], translation: "Ես քիչ եմ խոսում:", verb: 'hablar' },
  { id: 16, correctWords: ["Tú", "hablas", "lento"], translation: "Դու դանդաղ ես խոսում:", verb: 'hablar' },
  { id: 17, correctWords: ["Él", "come", "rápido"], translation: "Նա արագ է ուտում:", verb: 'comer' },
  { id: 18, correctWords: ["Ellas", "viven", "cerca"], translation: "Նրանք մոտիկ են ապրում:", verb: 'vivir' },
  { id: 19, correctWords: ["Usted", "habla", "bien"], translation: "Դուք լավ եք խոսում:", verb: 'hablar' },
  { id: 20, correctWords: ["Nosotros", "comemos", "carne"], translation: "Մենք միս ենք ուտում:", verb: 'comer' },
];

function shuffleArray(array: string[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function SentenceBuilder() {
  const [view, setView] = useState<'intro' | 'play' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (view === 'play') {
      const task = SENTENCES[currentIdx];
      setShuffledWords(shuffleArray(task.correctWords));
      setSelectedWords([]);
      setIsCorrect(null);
    }
  }, [currentIdx, view]);

  const toggleWord = (word: string, fromShuffled: boolean) => {
    if (isCorrect !== null) return;

    if (fromShuffled) {
      setSelectedWords([...selectedWords, word]);
      const idx = shuffledWords.indexOf(word);
      const newShuffled = [...shuffledWords];
      newShuffled.splice(idx, 1);
      setShuffledWords(newShuffled);
    } else {
      setShuffledWords([...shuffledWords, word]);
      const idx = selectedWords.lastIndexOf(word);
      const newSelected = [...selectedWords];
      newSelected.splice(idx, 1);
      setSelectedWords(newSelected);
    }
  };

  const checkAnswer = () => {
    const task = SENTENCES[currentIdx];
    const userSentence = selectedWords.join(' ');
    const correctSentence = task.correctWords.join(' ');
    
    const correct = userSentence === correctSentence;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
      if (currentIdx === SENTENCES.length - 1) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const nextTask = () => {
    if (currentIdx < SENTENCES.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setView('result');
    }
  };

  const startTraining = () => {
    setCurrentIdx(0);
    setScore(0);
    setView('play');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl z-10">
        
        {view === 'intro' && (
          <div className="max-w-md w-full text-center space-y-10 mx-auto">
            <div className="space-y-6">
               <div className="w-32 h-32 bg-orange-500 rounded-[32px] flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(249,115,22,0.3)] rotate-3">
                  <Puzzle size={60} className="text-white" />
               </div>
               <div className="space-y-4">
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Sentence <span className="text-orange-500">Builder</span></h1>
                  <p className="text-neutral-400 font-medium italic">Դասավորե՛ք բառերը ճիշտ հերթականությամբ՝ կազմելով նախադասություններ **hablar**, **comer** և **vivir** բայերով:</p>
               </div>
            </div>

            <button 
              onClick={startTraining}
              className="w-full py-6 bg-orange-500 text-white rounded-[40px] font-black uppercase text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 italic"
            >
              Start Building <Play fill="currentColor" size={24} />
            </button>
          </div>
        )}

        {view === 'play' && (
          <div className="space-y-12">
            {/* Header */}
            <div className="flex justify-between items-center px-4">
               <div className="flex items-center gap-2">
                  <Type className="text-orange-500" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Sentence {currentIdx + 1}/{SENTENCES.length}</span>
               </div>
               <div className="text-right">
                  <span className="block text-[8px] font-black uppercase text-neutral-500 tracking-widest">Score</span>
                  <span className="text-xl font-black italic text-orange-500 tracking-tighter">{score}</span>
               </div>
            </div>

            {/* Blackboard/Task Area */}
            <div className="space-y-8">
               <div className="text-center space-y-4">
                  <p className="text-neutral-500 font-bold italic text-lg">{SENTENCES[currentIdx].translation}</p>
                  
                  {/* Selected Words Area */}
                  <div className="min-h-[120px] bg-neutral-900/50 backdrop-blur-xl border-4 border-dashed border-neutral-800 rounded-[40px] p-8 flex flex-wrap justify-center gap-3 items-center">
                     {selectedWords.map((word, i) => (
                        <button
                          key={`${word}-${i}`}
                          onClick={() => toggleWord(word, false)}
                          className="px-6 py-3 bg-white text-neutral-950 rounded-2xl font-black text-xl italic shadow-xl"
                        >
                          {word}
                        </button>
                     ))}
                     {selectedWords.length === 0 && (
                        <p className="text-neutral-700 font-black uppercase tracking-widest text-xs italic">Ընտրեք բառերը ներքևից</p>
                     )}
                  </div>
               </div>

               {/* Word Pool */}
               <div className="flex flex-wrap justify-center gap-3">
                  {shuffledWords.map((word, i) => (
                    <button
                      key={`${word}-${i}-pool`}
                      onClick={() => toggleWord(word, true)}
                      className="px-6 py-4 bg-neutral-800 border-2 border-neutral-700 text-neutral-300 rounded-2xl font-bold text-xl hover:border-orange-500/50 hover:text-white transition-all shadow-lg"
                    >
                      {word}
                    </button>
                  ))}
               </div>
            </div>

            {/* Action Bar */}
            <div className="h-24 py-4">
               {isCorrect === null ? (
                 selectedWords.length === SENTENCES[currentIdx].correctWords.length && (
                   <button
                     onClick={checkAnswer}
                     className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl"
                   >
                     Check Sentence
                   </button>
                 )
               ) : (
                 <div 
                   className={`p-6 rounded-[32px] flex items-center justify-between border-4 ${isCorrect ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/10 border-rose-400'}`}
                 >
                    <div className="flex items-center gap-4">
                       {isCorrect ? (
                          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                             <CheckCircle2 size={30} />
                          </div>
                       ) : (
                          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white">
                             <XCircle size={30} />
                          </div>
                       )}
                       <div>
                          <p className={`font-black uppercase tracking-widest text-xs ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {isCorrect ? "Perfectly Done!" : "Almost There!"}
                          </p>
                          <p className="text-white font-bold italic">
                             {isCorrect ? "Ապրե՛ս, ճիշտ է:" : `Ճիշտ է՝ ${SENTENCES[currentIdx].correctWords.join(' ')}`}
                          </p>
                       </div>
                    </div>
                    <button 
                      onClick={nextTask}
                      className="p-4 bg-white text-neutral-950 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                       <ArrowRight size={24} />
                    </button>
                 </div>
               )}
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="max-w-md w-full text-center space-y-12 mx-auto">
            <div className="space-y-6">
               <Trophy size={100} className="text-orange-500 mx-auto drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]" />
               <div className="space-y-2">
                  <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Constructor Master!</h2>
                  <p className="text-xl font-bold text-neutral-400">Դուք փայլուն կազմեցիք բոլոր նախադասությունները: <br/> {score} / {SENTENCES.length}</p>
               </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-[50px] relative overflow-hidden group">
               <div className="text-8xl font-black italic text-orange-500 tracking-tighter">
                 {Math.round((score/SENTENCES.length) * 100)}%
               </div>
               <p className="text-[10px] uppercase font-black text-neutral-500 tracking-[0.5em] mt-4">Syntax Fluency</p>
            </div>

            <button 
              onClick={() => setView('intro')}
              className="w-full py-7 bg-white text-neutral-900 rounded-[40px] font-black uppercase text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic"
            >
              Restart Session <RotateCcw size={28} />
            </button>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <footer className="fixed bottom-8 flex justify-center opacity-20 pointer-events-none">
        <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.6em] text-neutral-500">
          <span>Sentence Blocks</span>
          <div className="w-1 h-1 bg-neutral-700 rounded-full" />
          <span>Verb Conjugation</span>
          <div className="w-1 h-1 bg-neutral-700 rounded-full" />
          <span>Spanish Logic</span>
        </div>
      </footer>
    </div>
  );
}
