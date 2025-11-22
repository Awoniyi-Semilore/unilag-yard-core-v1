// List of authorized admin emails
export const ADMIN_EMAILS = [
  'semiloreawoniyi@gmail.com', // Replace with your email
  'semiloreawoniyi18@gmail.com',
  'admin@unilagyard.com',
  // Add employee emails here when needed
];

// Check if current user is admin
export const isAdminUser = (user) => {
  return user && ADMIN_EMAILS.includes(user.email);
};

// Admin authentication hook
export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && isAdminUser(user)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { isAdmin, loading };
};