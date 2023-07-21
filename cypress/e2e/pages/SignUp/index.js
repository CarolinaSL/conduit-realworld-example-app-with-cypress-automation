const element = require('./elements').ELEMENTS;
import { faker } from '@faker-js/faker';

class register{

    fillRegisterForm(name, email, password){
        cy.get(element.nameInput)
            .type(name)
            .should('have.attr', 'required');

        cy.get(element.emailInput)
            .type(email)
            .should('have.attr', 'type', 'email')
            .and('have.attr', 'required');

        cy.get(element.passwordInput)
            .type(password)
            .should('have.attr', 'type', 'password')
            .and('have.attr', 'required');
            
    }

    submitRegisterForm(){
        cy.intercept('POST', '/api/users').as('postUser');
        cy.intercept('GET', '/api/user').as('getUser');
        return cy.get(element.btnSubmit).click();

    }

    generateFixtureUsers(quantity) {
        const arrayCredentials = [];
        const arrayResponses = [];
        test : Cypress._.times(quantity, () => {
          cy.request({
                method: 'POST',
                url: '/api/users',
                body: {
                    user:{
                        username: faker.internet.userName(),
                        email:  faker.internet.email(),
                        password: faker.internet.password()
                    }
                }
            }).then((response) => {
                arrayCredentials.push(JSON.parse(response.requestBody));
                arrayResponses.push(response.body);
            });
        });
        cy.writeFile('cypress/fixtures/usersCredentials.json', arrayCredentials);
        cy.writeFile('cypress/fixtures/usersRegistered.json', arrayResponses);
    }

}

export default new register();