import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { API_URL } from "../utils.config";

const user = {
  userEmail: faker.internet.email(),
  userName: faker.internet.username(),
  password: faker.internet.password(),
};

let authToken: string;

test.beforeAll(async ({ request }) => {
  console.log(user.userEmail);
  console.log(user.password);
  //Create a new user
  const signUpResponse = await request.post(`${API_URL}/api/users`, {
    data: {
      user: {
        email: user.userEmail,
        password: user.password,
        username: user.userName,
      },
    },
  });
  const signUpResBody = await signUpResponse.json();
  expect(signUpResponse.status()).toEqual(201);
  authToken = signUpResBody.user.token;
});

test("Create a new Article", async ({ request }) => {
  const article = {
    title: faker.lorem.word(),
    description: faker.lorem.sentence(),
    body: faker.lorem.text(),
  };

  const createAticle = await request.post(`${API_URL}/api/articles/`, {
    data: {
      article: {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: [],
      },
    },
    headers: {
      Authorization: `Token ${authToken}`,
    },
  });
  expect(createAticle.status()).toEqual(201);
});
test.describe("Mofidy the Article: edit and delete", () => {
  let targetArticle: string;

  test.beforeEach(async ({ request }) => {
    const article = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      body: faker.lorem.text(),
    };

    const createAticle = await request.post(`${API_URL}/api/articles/`, {
      data: {
        article: {
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    expect(createAticle.status()).toEqual(201);
    const createArticleResponse = await createAticle.json();
    targetArticle = createArticleResponse.article.slug;
  });

  test("Edit the Article", async ({ request }) => {
    const articleDataToUpdate = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      body: faker.lorem.text(),
    };
    const updatedArticle = await request.put(
      `${API_URL}/api/articles/${targetArticle}`,
      {
        data: {
          article: {
            title: articleDataToUpdate.title,
            description: articleDataToUpdate.description,
            body: articleDataToUpdate.body,
            tagList: [],
            slug: targetArticle,
          },
        },
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    expect(updatedArticle.status()).toEqual(200);
    const updatedArticleResponse = await updatedArticle.json();
    expect(updatedArticleResponse.article.title).toEqual(
      articleDataToUpdate.title
    );
    expect(updatedArticleResponse.article.description).toEqual(
      articleDataToUpdate.description
    );
    expect(updatedArticleResponse.article.body).toEqual(
      articleDataToUpdate.body
    );
  });

  test("Delete the Article", async ({ request }) => {
    const deletedArticle = await request.delete(
      `${API_URL}/api/articles/${targetArticle}`,
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
    expect(deletedArticle.status()).toEqual(204);
  });
});
