export type AnyErrorObject = {
  success: false;
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message: string;
    }[];
    name: "ZodError";
  };
};
