import { useCallback, useState } from 'react';
import { GameItem, fetchGamesFromApi } from '../config/api';

export const useGame = () => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchGamesFromApi();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    state: { games, loading, error },
    fetchGames,
    clearError,
  };
}; 