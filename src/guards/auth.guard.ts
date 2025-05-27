import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session || {};

    // Check if userId exists in the session
    if (!session.userId) {
      return false; // User is not authenticated
    }

    // If userId exists, allow access
    return true;
  }
}