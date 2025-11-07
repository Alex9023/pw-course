import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

const user = {
  userEmail: faker.internet.email(),
  userName: faker.internet.username(),
  password: faker.internet.password(),
};
let authToken: string;
test.beforeAll(async ({ request }) => {
  //Sign Up
  const signUpResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users",
    {
      data: {
        user: {
          email: user.userEmail,
          password: user.password,
          username: user.userName,
        },
      },
    }
  );
  expect(signUpResponse.status()).toEqual(201);
  console.log(await signUpResponse.json());
});

test("Positive - Sign In with valid credentials", async ({ request }) => {
  const signInResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: {
          email: user.userEmail,
          password: user.password,
        },
      },
    }
  );
  expect(signInResponse.status()).toEqual(200);
  const SignInResBody = await signInResponse.json();
  authToken = SignInResBody.user.token;
});

test.describe("Sign In with Invalid credentials", () => {
  const credentials = [
    {
      email: user.userEmail,
      password: "invalidPass1",
      reason: "Invalid Password",
    },
    {
      email: "invalidEmail@example.com",
      password: user.password,
      reason: "Invalid Email",
    },
  ];
  for (const userData of credentials) {
    test(`Positive - Sign In with ${userData.reason}`, async ({ request }) => {
      const signInResponse = await request.post(
        "https://conduit-api.bondaracademy.com/api/users/login",
        {
          data: {
            user: {
              email: userData.email,
              password: userData.password,
            },
          },
        }
      );
      expect(signInResponse.status()).toEqual(403);
      console.log(await signInResponse.json());
    });
  }
});


