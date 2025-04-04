export const getFirestore = jest.fn(() => ({}));
export const collection = jest.fn();
export const addDoc = jest.fn(() => Promise.resolve());
export const doc = jest.fn();
export const getDoc = jest.fn(() =>
  Promise.resolve({
    exists: () => true,
    data: () => ({
      name: "Test Artist",
      profileImage: "/default-avatar.png",
    }),
  })
);