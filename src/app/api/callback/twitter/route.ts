import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const oauth_verifier = searchParams.get('oauth_verifier');
        const oauth_token = searchParams.get('oauth_token');

        if (!oauth_verifier || !oauth_token) {
            return NextResponse.json(
                { error: 'Missing required OAuth parameters' },
                { status: 400 }
            );
        }

        // Create URL with search params for the spec page
        const specPageUrl = new URL('/search-url', request.url);
        specPageUrl.searchParams.set('callback', 'twitter');
        specPageUrl.searchParams.set('status', 'success');
        specPageUrl.searchParams.set('timestamp', new Date().toISOString());

        return NextResponse.redirect(specPageUrl);

    } catch (error) {
        console.error('Twitter callback error:', error);
        
        // Redirect to spec page with error information
        const errorUrl = new URL('/search-url', request.url);
        errorUrl.searchParams.set('status', 'error');
        errorUrl.searchParams.set('error_message', error instanceof Error ? error.message : 'Unknown error');
        
        return NextResponse.redirect(errorUrl);
    }
}
