import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    apiUrl = environment.apiUrl + '/v1/api';

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(this.apiUrl + '/auth', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient
            .post(this.apiUrl + '/login', {
                db: 'Hawsaba17',
                login: credentials.email,
                password: credentials.password,
            })
            .pipe(
                switchMap((response: any) => {
                    // Store the access token in the local storage
                    const data = response.data;
                    this.accessToken = data.access_token;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = {
                        id: data.uid ,
                        name: data.name || 'Admin',
                        login: data.login,
                        employeeId: data.employee_id === false? null : data.employee_id,
                        status: 'online',

                    };

                    // Return a new observable with the response
                    return of(response);
                })
             /*   catchError(() =>{

                    this.accessToken = '80156ca8d911e63a22efb2fedb82de89e90e0e88';
                    this._authenticated = true;
                    this._userService.user = {
                        id: '1',
                        name: 'Admin',
                        email: credentials.email,
                        avatar: 'assets/images/avatars/profile.jpg',
                        status: 'online',
                    };
                    return of({ data : this._userService.user , accessToken: this.accessToken  });
                    })*/
            );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return of(this.accessToken);
        /*     return this._httpClient
                 .post('api/auth/sign-in-with-token', {
                     accessToken: this.accessToken,
                 })
                 .pipe(
                     catchError(() =>
                         // Return false
                         of(false)
                     ),
                     switchMap((response: any) => {
                         // Replace the access token with the new one if it's available on
                         // the response object.
                         //
                         // This is an added optional step for better security. Once you sign
                         // in using the token, you should generate a new one on the server
                         // side and attach it to the response object. Then the following
                         // piece of code can replace the token with the refreshed one.
                         if (response.accessToken) {
                             this.accessToken = response.accessToken;
                         }

                         // Set the authenticated flag to true
                         this._authenticated = true;

                         // Store the user on the user service
                         this._userService.user = response.user;

                         // Return true
                         return of(true);
                     })
                 );*/
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
 /*       if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }*/

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
