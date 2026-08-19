import { requiredEnv } from '../helpers/requiredEnv';

export const messages = {
    unauthorized: requiredEnv('UNAUTHORIZED_MESSAGE'),
    invalidLink: requiredEnv('INVALID_LINK_MESSAGE'),
    updateSuccess: requiredEnv('UPDATE_SUCCESS_MESSAGE'),
    updateError: requiredEnv('UPDATE_ERROR_MESSAGE'),
};
