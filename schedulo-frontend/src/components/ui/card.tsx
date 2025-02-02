import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ✅ New Delete Button Component (Handles Confirmation Popup)
const DeleteButton = ({
  eventId,
  onDelete,
}: {
  eventId: string;
  onDelete: (id: string) => void;
}) => {
  const [showPopup, setShowPopup] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents event from propagating to parent
  };

  return (
    <div>
      {/* Delete Icon Button */}
      <Button
        variant="destructive"
        className="rounded-xl"
        onClick={(e) => {
          e.stopPropagation(); // Prevents event from propagating to parent
          setShowPopup(true);
        }}
      >
        <Trash2 className="w-4 h-2" />
      </Button>

      {/* Confirmation Popup */}
      {showPopup && (
        <div
          className="absolute top-10 right-0 bg-white border rounded-lg shadow-md p-4 w-64 z-50"
          onClick={handlePopupClick} // Stop click propagation on the popup container
        >
          <p className="text-sm text-gray-700">Type "delete" to confirm:</p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="mt-2 w-full border rounded p-2 text-sm"
            onClick={handlePopupClick} // Stop click propagation on input field
          />
          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={confirmText !== "delete"}
              onClick={() => {
                onDelete(eventId);
                setShowPopup(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  DeleteButton,
};
