import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Thread {
  id: number;
  title: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  } | null;
  category?: {
    id: number;
    name: string;
    color: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
  viewCount?: number;
  score?: number;
}

interface ThreadListProps {
  threads: Thread[];
}

export default function ThreadList({ threads }: ThreadListProps) {
  if (!threads || threads.length === 0) {
    return (
      <div className="mt-6 text-center py-8 bg-white shadow overflow-hidden sm:rounded-md">
        <p className="text-gray-500">No threads found</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const difference = now.getTime() - date.getTime();
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // If less than 1 day, show relative time
    if (difference < ONE_DAY) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show the date
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link href={`/threads/${thread.id}`}>
              <a className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={thread.user?.avatar} alt={thread.user?.name || 'Anonymous'} />
                          <AvatarFallback className="bg-primary-100 text-primary-800">
                            {thread.user ? getInitials(thread.user.name) : '?'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-primary-600 truncate">
                          {thread.title}
                        </h3>
                        <div className="mt-1 flex text-sm text-gray-500">
                          <span className="truncate">{thread.user?.name || 'Anonymous'}</span>
                          {thread.category && (
                            <>
                              <span className="mx-1">&middot;</span>
                              <Badge 
                                style={{ backgroundColor: thread.category.color }}
                              >
                                {thread.category.name}
                              </Badge>
                            </>
                          )}
                          <span className="mx-1">&middot;</span>
                          <span>Posted {formatDate(thread.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                        <span className="ml-1 text-sm text-gray-500">{thread.replyCount || 0} replies</span>
                      </div>
                      {thread.score !== undefined && (
                        <div className="flex items-center">
                          <ThumbsUp className="h-5 w-5 text-gray-400" />
                          <span className="ml-1 text-sm text-gray-500">{thread.score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
