import { APIRequestContext } from '@playwright/test';

/**
 * Result of a call. `body` is typed with what the endpoint *should* return,
 * but it is not verified here: contract tests validate it with a schema.
 */
export interface ApiResult<T> {
  status: number;
  body: T;
}

/** Base class: owns the request context; subclasses only describe endpoints. */
export abstract class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get<T>(path: string): Promise<ApiResult<T>> {
    return this.toResult<T>(await this.request.get(path));
  }

  protected async post<T>(path: string, data: unknown): Promise<ApiResult<T>> {
    return this.toResult<T>(await this.request.post(path, { data }));
  }

  private async toResult<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<ApiResult<T>> {
    const text = await response.text();
    return { status: response.status(), body: (text ? JSON.parse(text) : undefined) as T };
  }
}
