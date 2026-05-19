import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // ✅ sécurité SSR / Node
  if (typeof window === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');

  console.log("INTERCEPTOR TOKEN =>", token);

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
