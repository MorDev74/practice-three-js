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
        const specPageUrl = new URL('/spec', request.url);
        specPageUrl.searchParams.set('oauth_verifier', oauth_verifier);
        specPageUrl.searchParams.set('oauth_token', oauth_token);
        specPageUrl.searchParams.set('status', 'success');
        specPageUrl.searchParams.set('timestamp', new Date().toISOString());

        return NextResponse.redirect(specPageUrl);

    } catch (error) {
        console.error('Twitter callback error:', error);
        
        // Redirect to spec page with error information
        const errorUrl = new URL('/spec', request.url);
        errorUrl.searchParams.set('status', 'error');
        errorUrl.searchParams.set('error_message', error instanceof Error ? error.message : 'Unknown error');
        errorUrl.searchParams.set('timestamp', new Date().toISOString());
        
        return NextResponse.redirect(errorUrl);
    }
}
