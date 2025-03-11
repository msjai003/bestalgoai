
// Mock test connection functions
export const testSupabaseConnection = async () => {
  return {
    success: false,
    message: "Database connection has been removed from the project"
  };
};

export const testTableAccess = async (tableName: string) => {
  return {
    success: false,
    message: `Database connection to ${tableName} has been removed from the project`
  };
};

export const storeSignupData = async (email: string, password: string, confirmPassword: string) => {
  return {
    success: false,
    message: "Database connection has been removed from the project"
  };
};
