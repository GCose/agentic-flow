import { Sparkles, Clock, ArrowRight } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon = ({
  title = "Coming Soon",
  description = "This feature is currently under development and will be available soon.",
}: ComingSoonProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/*==================== Animated Icon ====================*/}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-purple-900/30 rounded-full flex items-center justify-center border border-blue-900/40">
            <Clock className="w-12 h-12 text-blue-400" />
          </div>

          {/*==================== Floating sparkles ====================*/}
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          {/*==================== End of Floating sparkles ====================*/}
          <div className="absolute -bottom-2 -left-2 animate-bounce delay-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
        </div>
        {/*==================== End of Animated Icon ====================*/}

        {/*==================== Main Content ====================*/}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        {/*==================== End of Main Content ====================*/}

        {/*==================== Call to Action Hint ====================*/}
        <div className="bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-purple-900/10 rounded-xl p-6 border border-blue-900/20">
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <span className="text-sm font-medium">Stay tuned for updates</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        {/*==================== End of Call to Action Hint ====================*/}
      </div>
    </div>
  );
};

export default ComingSoon;
