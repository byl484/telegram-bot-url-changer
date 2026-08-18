import 'dotenv/config';

export const messages = {
    unauthorized: process.env.UNAUTHORIZED_MESSAGE ?? 'Unauthorized',
    invalidLink: process.env.INVALID_LINK_MESSAGE ?? 'Please send a valid Spotify link.',
    updateSuccess: process.env.UPDATE_SUCCESS_MESSAGE ?? 'Link updated successfully to:',
    updateError: process.env.UPDATE_ERROR_MESSAGE ?? 'Failed to update the link.',
};
