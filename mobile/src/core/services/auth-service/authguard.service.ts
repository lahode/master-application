/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   21-09-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 21-09-2017
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AppStateI } from '../../app-state-module';

@Injectable()
export class AuthGuard {}
