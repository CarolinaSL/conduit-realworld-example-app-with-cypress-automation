/// <reference types="Cypress" />
import login from '../login/index';
import home from '../home/index'
import editor from '../editor/index'
import { faker } from '@faker-js/faker';
const element = require('./elements').ELEMENTS;


describe('Gerenciar artigo - versão com Page Objects', () => {

    beforeEach(() => {
        home.accessHomePage('/');
        home.accessLoginPage();
        login.validateLoginPage();
        login.loginWithValidCredentials('carol@teste.com','123456');
        
    });

    it('Criar artigo com sucesso usando tag', () => {
        const title = faker.lorem.sentence(3);
        const description = faker.lorem.sentence();
        const text = faker.lorem.paragraph();
        const tag = faker.lorem.word();

        home.acessNewArticlePage();
        editor.fillArticleForm(title,description,text,tag);
        editor.publishArticle().then(() => {
            cy.get('@titleArticle').then((el) => {
                cy.url().should('include','/article/')
                cy.contains(title)
                cy.contains(tag);
            })
            
        });
       
    });
});

describe('Gerenciar artigo - versão com uso de custom commands e login UI', () => {

    beforeEach(() => {

        cy.visit('#/login');
        cy.loginUI('carol@teste.com','123456');
        
    });

    it('Criar artigo com sucesso usando tag', () => {
        const title = faker.lorem.sentence(3);
        const description = faker.lorem.sentence();
        const text = faker.lorem.paragraph();
        const tag = faker.lorem.word();

        cy.contains('New Article')
        .should('have.attr','href','#/editor')
        .click();

        cy.fillArticle(title, description, text, tag);

        cy.intercept('POST', '/api/articles').as('postArticle');
        cy.intercept('GET', '/api/articles/**').as('getArticles');

        cy.get(element.btnPublish)
            .should('be.visible')
            .and('have.attr', 'type', 'submit')
            .click().then(() => {
                cy.wait('@postArticle').then(({response}) => {
                    expect(response.statusCode).to.equal(201);
                });
                cy.wait('@getArticles').its('response.statusCode').should('eq', 200);
                cy.url().should('include','/article/')
                cy.contains(title)
                cy.contains(tag);   
                });

    });
});

describe('Gerenciar artigo - versão com uso de custom commands e login via API', () => {

    beforeEach(() => {

        cy.loginAPI('carol@teste.com','123456').as('session');
        cy.visit('#/editor');
        
    });

    it('Criar artigo com sucesso usando tag ', () => {

        const title = faker.lorem.sentence(3);
        const description = faker.lorem.sentence();
        const text = faker.lorem.paragraph();
        const tag = faker.lorem.word(4);

        cy.contains('New Article', )
        .should('have.attr','href','#/editor')
        .click();

        cy.fillArticle(title, description, text, tag);

        cy.intercept('POST', '/api/articles').as('postArticle');
        cy.intercept('GET', '/api/articles/**').as('getArticles');

        cy.get(element.btnPublish)
            .should('be.visible')
            .and('have.attr', 'type', 'submit')
            .click().then(() => {
                cy.wait('@postArticle').then(({response}) => {
                    expect(response.statusCode).to.equal(201);
                });
                cy.wait('@getArticles').its('response.statusCode').should('eq', 200);
                cy.url().should('include','/article/')
                cy.contains(title)
                cy.get('ul.tag-list').should('be.visible').contains(tag);   
                });

    });

    it('Criar artigo com sucesso sem usar tag ', () => {

        const title = faker.lorem.sentence(3);
        const description = faker.lorem.sentence();
        const text = faker.lorem.paragraph();
        

        cy.contains('New Article', )
        .should('have.attr','href','#/editor')
        .click();

        cy.fillArticle(title, description, text);

        cy.intercept('POST', '/api/articles').as('postArticle');
        cy.intercept('GET', '/api/articles/**').as('getArticles');

        cy.get(element.btnPublish)
            .should('be.visible')
            .and('have.attr', 'type', 'submit')
            .click().then(() => {
                cy.wait('@postArticle').then(({response}) => {
                    expect(response.statusCode).to.equal(201);
                });
                cy.wait('@getArticles').its('response.statusCode').should('eq', 200);
                cy.url().should('include','/article/')
                cy.contains(title)
                cy.get('ul.tag-list').should('not.exist');  
                });

    });

    it('Excluir artigo postado pelo usuário', () => {
        
      
        let loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'));
        const article = editor.createRandomArticle();

        cy.postArticleAPI(article,loggedUser);
      
        cy.accessProfile();

        cy.get('div.row').find('div.article-preview').eq(0).find('h1').click().then(() => {
            cy.get('@article').then((list) => {
                cy.contains(list.body.article.title);
            });
        });
        cy.intercept('DELETE', '/api/articles/**').as('deleteArticle');

        cy.contains(' Delete Article').click().then(() => {
            cy.wait('@deleteArticle').its('response.statusCode').should('eq',200);
        })
    });


});
