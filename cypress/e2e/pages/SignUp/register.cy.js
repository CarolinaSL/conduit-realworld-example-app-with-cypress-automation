import login from '../login/index';
import home from '../home/index'
import register from './index';
import { faker } from '@faker-js/faker';
const element = require('./elements').ELEMENTS;


describe('Register Feature', () => {

    beforeEach(() => {
        cy.visit('/');
        home.accessLoginPage();
        login.validateLoginPage();
        
    })

    Cypress._.times(3, () => {
        it('Criar conta para usuário não existente', () => {
        
            login.acessarPaginaRegistro().then(() => {
                cy.url().should('include', '/register');
           });
           register.fillRegisterForm(faker.person.fullName(), faker.internet.email(), faker.internet.password());
           register.submitRegisterForm().then(() => {
                cy.wait('@postUser').then(({response}) => {
                    expect(response.statusCode).to.eq(201);
                });
           });
        });
    });

    it('Sistema não deve permitir criação de contas para usuário já cadastrado', () => {
        
        login.acessarPaginaRegistro().then(() => {
            cy.url().should('include', '/register');
       });
       register.fillRegisterForm(Cypress.env('nameDefault'),Cypress.env('emailDefault'),Cypress.env('passwordDefault'));
       
       register.submitRegisterForm().then(() => {
            cy.wait('@postUser').then(({response}) => {
                expect(response.statusCode).to.eq(422)
            });
       });
    });

});

