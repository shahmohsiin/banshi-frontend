export interface GameItem {
  id: number;
  name: string;
  currentNumbers: string;
  openTime: string;
  closeTime: string;
  status: 'running' | 'closed' | 'upcoming';
}

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/games/all`;

export const fetchGamesFromApi = async (): Promise<GameItem[]> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data.status !== 'SUCCESS') {
      throw new Error('Failed to fetch games');
    }
    
    return data.response.map((game: any) => {
      const now = new Date();
      const openingTime = new Date(game.openingTime);
      const closingTime = new Date(game.closingTime);
      
      // Determine status
      let status: 'running' | 'closed' | 'upcoming';
      if (now < openingTime) {
        status = 'upcoming';
      } else if (now >= openingTime && now <= closingTime) {
        status = 'running';
      } else {
        status = 'closed';
      }
      
      // Calculate game numbers
      const currentNumbers = getGameNumbers(game, now, openingTime, closingTime);
      
      return {
        id: game.gameId,
        name: game.name,
        currentNumbers,
        openTime: formatTime(openingTime),
        closeTime: formatTime(closingTime),
        status,
      };
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getGameNumbers = (game: any, now: Date, openingTime: Date, closingTime: Date): string => {
  // If opening time hasn't passed, show *****
  if (now < openingTime) {
    return '*****';
  }
  
  // If opening time passed but closing time hasn't
  if (now >= openingTime && now < closingTime) {
    if (game.openResult) {
      const openSum = game.openResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const lastDigit = openSum % 10;
      return `${game.openResult}-${lastDigit}*-****`;
    }
    return '*****';
  }
  
  // If closing time has passed
  if (now >= closingTime) {
    if (game.openResult && game.closeResult) {
      const openSum = game.openResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const closeSum = game.closeResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const openLastDigit = openSum % 10;
      const closeLastDigit = closeSum % 10;
      return `${game.openResult}-${openLastDigit}${closeLastDigit}-${game.closeResult}`;
    }
    return '*****';
  }
  
  return '*****';
}; 