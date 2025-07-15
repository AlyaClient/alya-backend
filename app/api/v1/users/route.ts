import {NextRequest, NextResponse} from 'next/server';

// TODO: use a db
const onlineUsers = new Map<string, { userId: string; lastSeen: Date }>();

const cleanupInactiveUsers = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    for(const [sessionId, user] of onlineUsers.entries()) {
        if(user.lastSeen < fiveMinutesAgo) {
            onlineUsers.delete(sessionId);
        }
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {userId, sessionId, action} = body;

        if(!userId || !sessionId) {
            return NextResponse.json(
                {error: 'userId and sessionId are required'},
                {status: 400}
            );
        }

        cleanupInactiveUsers();

        switch(action) {
            case 'join':
                onlineUsers.set(sessionId, {
                    userId,
                    lastSeen: new Date()
                });
                break;

            case 'heartbeat':
                if(onlineUsers.has(sessionId)) {
                    onlineUsers.set(sessionId, {
                        userId,
                        lastSeen: new Date()
                    });
                } else {
                    onlineUsers.set(sessionId, {
                        userId,
                        lastSeen: new Date()
                    });
                }
                break;

            case 'leave':
                onlineUsers.delete(sessionId);
                break;

            default:
                return NextResponse.json(
                    {error: 'Invalid action. Use: join, heartbeat, or leave'},
                    {status: 400}
                );
        }

        const uniqueUsers = new Set(Array.from(onlineUsers.values()).map(user => user.userId));
        const onlineCount = uniqueUsers.size;

        return NextResponse.json({
            success: true,
            onlineUsers: onlineCount,
            totalSessions: onlineUsers.size,
            action: action || 'heartbeat'
        });

    } catch(error) {
        console.error('Error in online users endpoint:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

export async function GET() {
    try {
        cleanupInactiveUsers();

        const uniqueUsers = new Set(Array.from(onlineUsers.values()).map(user => user.userId));
        const onlineCount = uniqueUsers.size;

        return NextResponse.json({
            onlineUsers: onlineCount,
            totalSessions: onlineUsers.size
        });
    } catch(error) {
        console.error('Error getting online users:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}