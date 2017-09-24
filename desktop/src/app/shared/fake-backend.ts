import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
 
export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // Array in local storage for registered users
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
 
    // Configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
        // Wrap in timeout to simulate server api call
        setTimeout(() => {
 
            // Authentication 
            if (connection.request.url.endsWith('/authenticate') && connection.request.method === RequestMethod.Post) {
                // Get parameters from post request
                let params = JSON.parse(connection.request.getBody());
 
                // Find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.username === params.username && user.password === params.password;
                });
 
                // If login details are valid return 200 OK with user details and fake jwt token
                if (filteredUsers.length) {
                    let user = filteredUsers[0];
                    // Send back 200 OK
                    connection.mockRespond(resp({data: {token: 'fake-jwt-token', user: {
                        username: user.username,
                        name: user.name,
                        email: user.email
                    }}}));
                } 
                // Else send back 404 OK with a message
                else {
                    connection.mockRespond (resp({msg : "Authentification échouée"}, 400));
                }
 
                return;
            }
 
            // Register a new user
            if (connection.request.url.endsWith('/register') && connection.request.method === RequestMethod.Post) {
                // Get parameters from post request
                let newUser = JSON.parse(connection.request.getBody());
 
                // Check if user doesn't already exist
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                
                // If user doesn't exist, add to the list of existing users and return 200 OK with user details and fake jwt token
                if (!duplicateUser) {
                    // Save the new user
                    newUser.id = users.length + 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
     
                    // Send back 200 OK
                    connection.mockRespond(resp({data: {token: 'fake-jwt-token', user: newUser}}));
                }
                // Else send back 404 OK with a message
                else {
                    connection.mockRespond (resp({msg : "Impossible de créer l'utilisateur car celui-ci existe déjà"}, 400));
                }
                return;
            }

            // Register a new user
            if (connection.request.url.endsWith('/password-request') && connection.request.method === RequestMethod.Post) {
                // Get parameters from post request
                let email = JSON.parse(connection.request.getBody());
                
                // Find if any user matches email
                let filteredUsers = users.filter(user => { return user.email === email; }).length;

                // If user doesn't exist, add to the list of existing users and return 200 OK with user details and fake jwt token
                if (filteredUsers) {
                    // Send back 200 OK
                    connection.mockRespond(resp({msg: "Un nouveau mot de passe vous a été envoyé"}));
                }
                // Else send back 404 OK with a message
                else {
                    connection.mockRespond (resp({msg : "L'adresse e-mail que vous avez indiqué ne correspond à aucun utilisateur"}, 400));
                }
                return;
            }
 
            // Register a new user
            if (connection.request.url.endsWith('/confirmation-request') && connection.request.method === RequestMethod.Post) {
                // Get parameters from post request
                let email = JSON.parse(connection.request.getBody());
                
                // Find if any user matches email
                let filteredUsers = users.filter(user => { return user.email === email; }).length;

                // If user doesn't exist, add to the list of existing users and return 200 OK with user details and fake jwt token
                if (filteredUsers) {
                    // Send back 200 OK
                    connection.mockRespond(resp({msg: "Une confirmation vous a été envoyée"}));
                }
                // Else send back 404 OK with a message
                else {
                    connection.mockRespond (resp({msg : "L'adresse e-mail que vous avez indiqué ne correspond à aucun utilisateur"}, 400));
                }
                return;
            }
            
            // Pass through any requests not handled above
            let realHttp = new Http(realBackend, options);
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: JSON.parse(connection.request.getBody()),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {
                    connection.mockRespond(response);
                },
                (error: any) => {
                    connection.mockRespond (new Response (new ResponseOptions ({
                        body: {
                            msg : "Une erreur inattendue s'est produite"
                        },
                        status: 404
                    })));
                });
 
        }, 500);
 
    });

    return new Http(backend, options);
};

// Generate a HTTP response
function resp(body: any, status: number = 200) : any {
    return new Response (new ResponseOptions ({
        body: body,
        status: status
    }));
}
 
// Use fake backend in place of Http service for backend-less development
export let fakeBackendProvider = {
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};