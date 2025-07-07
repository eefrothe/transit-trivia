import React, { useState, useCallback, useEffect } from 'react';
import { Screen, Player, TriviaQuestion, AllPlayerStats, PowerUpType } from './types';
import { GAME_DURATION_S, TRANSIT_LOCATIONS, MATCHMAKING_TIMEOUT_MS, BOT_NAMES, BOT_COLORS } from './constants';
import { generateNewQuestion, generateTheme, generateQuestionBatch } from './services/geminiService';
import { soundService } from './services/soundService';
import { SpeakerOnIcon, SpeakerOffIcon, UserGroupIcon, HomeIcon, LogoutIcon } from './components/icons';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import ScoreScreen from './components/ScoreScreen';
import SuddenDeathScreen from './components/SuddenDeathScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import SocialScreen from './components/SocialScreen';
import { supabase } from './supabaseClient';



const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [gameTimeLeft, setGameTimeLeft] = useState(GAME_DURATION_S);
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [questionQueue, setQuestionQueue] = useState<TriviaQuestion[]>([]);
  const [theme, setTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suddenDeathPlayers, setSuddenDeathPlayers] = useState<Player[] | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [userLocation, setUserLocation] = useState<string>(`${TRANSIT_LOCATIONS[0].emoji} ${TRANSIT_LOCATIONS[0].label}`);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [hasIncrementedForSession, setHasIncrementedForSession] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const storedGamesPlayed = parseInt(localStorage.getItem('transitTriviaGamesPlayed') || '0', 10);
    if (!isNaN(storedGamesPlayed)) {
        setGamesPlayed(storedGamesPlayed);
    }
    // Check for "logged in" user
    const storedUsername = localStorage.getItem('transitTriviaUsername');
    const storedEmail = localStorage.getItem('transitTriviaEmail');
    if (storedUsername && storedEmail) {
        setUsername(storedUsername);
        setEmail(storedEmail);
    }
  }, []);


  const handleToggleMute = () => {
    const newMuteState = soundService.toggleMute();
    setIsMuted(newMuteState);
  };

  const addBotOpponents = useCallback(() => {
    const availableNames = [...BOT_NAMES];
    const botsToAdd: Player[] = [];
    const newStats: AllPlayerStats = {};

    for (let i = 0; i < 3; i++) {
        if (availableNames.length === 0) break;

        const nameIndex = Math.floor(Math.random() * availableNames.length);
        const name = availableNames.splice(nameIndex, 1)[0];
        const botId = `bot${i + 1}`;
        
        const bot: Player = {
            id: botId,
            name: name,
            isBot: true,
            color: BOT_COLORS[i % BOT_COLORS.length],
        };
        botsToAdd.push(bot);
        newStats[botId] = {
             score: 0, streak: 0,
             powerUpsUsed: { fiftyFifty: false, skip: false, doublePoints: false },
             isDoublePointsActive: false,
        };
    }

    // Add bots sequentially for a more realistic lobby-filling effect
    botsToAdd.forEach((bot, index) => {
        setTimeout(() => {
            setPlayers(prev => [...prev, bot]);
            setPlayerStats(prev => ({ ...prev, [bot.id]: newStats[bot.id] }));
        }, (index + 1) * 600);
    });
  }, []);

  const resetGame = useCallback(() => {
    setCurrentScreen(Screen.LOBBY);
    const userPlayerName = username ? username : `Guest @ ${userLocation}`;
    const userPlayer: Player = { id: 'user', name: userPlayerName, isBot: false, color: 'bg-cyan-500' };
    
    setPlayers([userPlayer]);
    setPlayerStats({
      [userPlayer.id]: {
        score: 0, streak: 0,
        powerUpsUsed: { fiftyFifty: false, skip: false, doublePoints: false },
        isDoublePointsActive: false,
      }
    });

    setGameTimeLeft(GAME_DURATION_S);
    setCurrentQuestion(null);
    setQuestionQueue([]);
    setTheme(null);
    setError(null);
    setSuddenDeathPlayers(null);
    setIsMatchmaking(true);
    setHasIncrementedForSession(false);
  }, [userLocation, username]);

  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const gameTheme = await generateTheme();
      setTheme(gameTheme);
      
      const questions = await generateQuestionBatch(gameTheme, 15);
      
      if (questions && questions.length > 0) {
        setCurrentQuestion(questions[0]);
        setQuestionQueue(questions.slice(1));
      } else {
        throw new Error("Received no questions for the game.");
      }

    } catch (err) {
      setError('Failed to start the game. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Matchmaking simulation
  useEffect(() => {
    if (currentScreen === Screen.LOBBY && isMatchmaking) {
        const timer = setTimeout(() => {
            addBotOpponents();
            setIsMatchmaking(false);
        }, MATCHMAKING_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }
  }, [currentScreen, isMatchmaking, addBotOpponents]);

  const advanceToNextQuestion = useCallback(async () => {
    if (questionQueue.length > 0) {
        setCurrentQuestion(questionQueue[0]);
        setQuestionQueue(prev => prev.slice(1));
    } else {
        console.warn("Question queue depleted! Ending game.");
        setGameTimeLeft(0);
    }
  }, [questionQueue]);

  const handleCreateGame = (isGuest: boolean = false) => {
    soundService.init();
    setIsMuted(soundService.isMuted);
    soundService.play('start');
    if (isGuest) {
      handleLogout(false); // Clear any existing profile without redirecting
    }
    resetGame();
  };
  
  const handleSignup = (userEmail: string, userName: string) => {
    setEmail(userEmail);
    setUsername(userName);
    localStorage.setItem('transitTriviaEmail', userEmail);
    localStorage.setItem('transitTriviaUsername', userName);
    setCurrentScreen(Screen.HOME);
    setActiveTab('home');
  };

  const handleLogin = (userEmail: string) => {
    // In a real app, you'd fetch the username associated with this email
    const storedUser = localStorage.getItem('transitTriviaUsername') || 'NewPlayer';
    setEmail(userEmail);
    setUsername(storedUser);
    localStorage.setItem('transitTriviaEmail', userEmail);
    localStorage.setItem('transitTriviaUsername', storedUser);
    setCurrentScreen(Screen.HOME);
    setActiveTab('home');
  };


  const handleLogout = (redirect = true) => {
    setEmail(null);
    setUsername(null);
    localStorage.removeItem('transitTriviaUsername');
    localStorage.removeItem('transitTriviaEmail');
    if (redirect) {
        setCurrentScreen(Screen.HOME);
        setActiveTab('home');
    }
  };

  useEffect(() => {
    if (currentScreen === Screen.LOBBY && !theme && !isLoading) {
      initializeGame();
    }
  }, [currentScreen, theme, initializeGame, isLoading]);
  
  const handleStartGame = useCallback(() => {
    soundService.play('start');
    setCurrentScreen(Screen.GAME);
  }, []);

  const handleAnswer = useCallback((playerId: string, isCorrect: boolean) => {
    if (playerId === 'user') {
      soundService.play(isCorrect ? 'correct' : 'incorrect');
    }
    setPlayerStats(prevStats => {
      const newStats = { ...prevStats };
      const player = newStats[playerId];
      if (isCorrect) {
        if (player.isDoublePointsActive) {
            player.score += 2;
            player.isDoublePointsActive = false;
        } else {
            player.score += 1;
        }
        player.streak += 1;
      } else {
        player.streak = 0;
        player.isDoublePointsActive = false;
      }
      return newStats;
    });
  }, []);
  
  const handleUsePowerUp = (playerId: string, powerUp: PowerUpType) => {
    if (playerId !== 'user' || playerStats[playerId]?.powerUpsUsed[powerUp]) return;

    soundService.play('powerup');
    
    setPlayerStats(prev => {
        const newStats = {...prev};
        const player = newStats[playerId];
        player.powerUpsUsed = { ...player.powerUpsUsed, [powerUp]: true };

        if (powerUp === 'doublePoints') {
            player.isDoublePointsActive = true;
        }
        
        return newStats;
    });
    
    if (powerUp === 'skip') {
        soundService.play('skip');
        setTimeout(() => advanceToNextQuestion(), 200);
    }
  };

  const handleSuddenDeathAnswer = (winnerId: string) => {
      if (winnerId === 'user') {
          soundService.play('win');
      } else {
          soundService.play('lose');
      }
      setPlayerStats(prev => ({...prev, [winnerId]: {...prev[winnerId], score: prev[winnerId].score + 1 }}));
      setCurrentScreen(Screen.SCORE);
  };

  const handlePlayAgain = () => {
    soundService.play('start');
    if (username) {
        setCurrentScreen(Screen.HOME);
        setActiveTab('home');
    } else {
        resetGame();
    }
  };
  
  useEffect(() => {
    if (currentScreen !== Screen.GAME) return;

    if (gameTimeLeft <= 0) {
      if (!hasIncrementedForSession) {
        const newGamesPlayed = gamesPlayed + 1;
        setGamesPlayed(newGamesPlayed);
        localStorage.setItem('transitTriviaGamesPlayed', newGamesPlayed.toString());
        setHasIncrementedForSession(true);
      }

      const scores = Object.values(playerStats).map(s => s.score);
      const maxScore = Math.max(...scores);
      const playersWithMaxScore = players.filter(p => playerStats[p.id].score === maxScore);
      
      if (playersWithMaxScore.length > 1) {
        setSuddenDeathPlayers(playersWithMaxScore);
        setCurrentScreen(Screen.SUDDEN_DEATH);
      } else {
        if (playersWithMaxScore.length === 1 && playersWithMaxScore[0].id === 'user') {
          soundService.play('win');
        } else {
          soundService.play('lose');
        }
        setCurrentScreen(Screen.SCORE);
      }
      return;
    }

    const timerId = setInterval(() => {
      setGameTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentScreen, gameTimeLeft, players, playerStats, gamesPlayed, hasIncrementedForSession, username]);

  const renderContent = () => {
    if (username && activeTab === 'social') {
      return <SocialScreen onCreateGame={() => handleCreateGame()} />;
    }
    return <HomeScreen 
      onGuestPlay={() => handleCreateGame(true)}
      onMatchmakingPlay={() => handleCreateGame()}
      userLocation={userLocation}
      onLocationChange={setUserLocation}
      locations={TRANSIT_LOCATIONS}
      username={username}
      onLoginClick={() => setCurrentScreen(Screen.LOGIN)}
      onSignupClick={() => setCurrentScreen(Screen.SIGNUP)}
    />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SIGNUP:
        return <SignupScreen onSignup={handleSignup} onLoginClick={() => setCurrentScreen(Screen.LOGIN)} />;
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} onSignupClick={() => setCurrentScreen(Screen.SIGNUP)} />;
      case Screen.LOBBY:
        return <LobbyScreen 
                  players={players} 
                  playerStats={playerStats} 
                  onStartGame={handleStartGame} 
                  isReady={!!currentQuestion && !isLoading && !isMatchmaking} 
                  theme={theme}
                  isMatchmaking={isMatchmaking}
                />;
      case Screen.GAME:
        return (
          <GameScreen
            players={players}
            playerStats={playerStats}
            question={currentQuestion}
            gameTimeLeft={gameTimeLeft}
            onAnswer={handleAnswer}
            onNextQuestion={advanceToNextQuestion}
            onUsePowerUp={handleUsePowerUp}
            isLoading={isLoading || !currentQuestion}
            error={error}
            theme={theme}
          />
        );
      case Screen.SUDDEN_DEATH:
        return <SuddenDeathScreen players={suddenDeathPlayers!} onWin={handleSuddenDeathAnswer} theme={theme!} />;
      case Screen.SCORE:
        return <ScoreScreen players={players} playerStats={playerStats} onPlayAgain={handlePlayAgain} gamesPlayed={gamesPlayed} />;
      case Screen.HOME:
      default:
        return renderContent();
    }
  };

  return (
    <main className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans relative">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
           {username && (
            <button onClick={() => handleLogout()} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Logout">
                <LogoutIcon className="w-6 h-6 text-slate-400" />
            </button>
          )}
          <button onClick={handleToggleMute} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <SpeakerOffIcon className="w-6 h-6 text-slate-400" /> : <SpeakerOnIcon className="w-6 h-6 text-white" />}
          </button>
        </div>
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
            {renderScreen()}
        </div>
        {username && currentScreen === Screen.HOME && (
            <footer className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700">
                <nav className="max-w-2xl mx-auto flex justify-around items-center h-16">
                    <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${activeTab === 'home' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>
                        <HomeIcon className="w-6 h-6" />
                        <span className="text-xs font-semibold">Play</span>
                    </button>
                    <button onClick={() => setActiveTab('social')} className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${activeTab === 'social' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>
                        <UserGroupIcon className="w-6 h-6" />
                        <span className="text-xs font-semibold">Social</span>
                    </button>
                </nav>
            </footer>
        )}
    </main>
  );
};

export default App;