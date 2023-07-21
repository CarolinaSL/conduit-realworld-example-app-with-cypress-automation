const element = require('./elements').ELEMENTS;
const elementHeader = require('../superiorMenu/elements').ELEMENTS;
import { faker } from '@faker-js/faker';

class editor{

    fillArticleForm(title, description, text,tag){

        cy.get(element.inputTitleArticle).type(title).as('titleArticle');
        cy.get(element.inputDescriptionArticle).type(description);
        cy.get(element.inputTextArticle).type(text);
        cy.get(element.inputTagArticle).type(tag);

    }

    publishArticle(){
        cy.intercept('POST', '/api/articles').as('postArticle');

        return cy.get(element.btnPublish)
                    .should('be.visible')
                    .and('have.attr', 'type', 'submit')
                    .click().then(() => {
                        cy.wait('@postArticle').then(({response}) => {
                            expect(response.statusCode).to.equal(201);
                        });
                    });
    }

    createRandomArticle(){
        return {
            article:{
                body: faker.lorem.paragraph(),
                description: faker.lorem.sentence(),
                tagList: '',
                title: faker.lorem.sentence(3) 
            }
        }
    }

}

export default new editor();