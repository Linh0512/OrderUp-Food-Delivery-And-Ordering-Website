// Simple debug utility for tracking authentication issues

export const debugLogin = (stage, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [LOGIN DEBUG] [${stage}]:`, data);
};

export const debugAuth = {
  check: () => {
    try {
      const userData = localStorage.getItem('user_data');
      console.log('Current localStorage user_data:', userData);
      return !!userData;
    } catch (error) {
      console.error('Error checking localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem('user_data');
      console.log('Cleared localStorage user_data');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};