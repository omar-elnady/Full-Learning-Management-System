import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const CourseCard = ({ course, onGoToCourse }: CourseCardProps) => {
  return (
    <Card
      className="group relative flex flex-col h-full w-full cursor-pointer overflow-hidden rounded-xl border-none bg-background shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-card"
      onClick={() => onGoToCourse(course)}
    >
      <CardHeader className="p-0 relative h-48 w-full overflow-hidden rounded-t-xl">
        <Image
          src={course.image || "/placeholder.png"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </CardHeader>

      <CardContent className="flex flex-col flex-grow p-5 gap-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <Avatar className="w-8 h-8 ring-2 ring-background">
            <AvatarImage alt={course.teacherName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {course.teacherName[0]}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {course.teacherName}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border/50 bg-muted/20 sm:p-5">
        <Badge variant="secondary" className="px-2 py-1 mt-2 text-[10px] font-semibold uppercase tracking-wider">
          {course.category}
        </Badge>
        <span className="text-lg mt-2 font-bold text-primary">
          {formatPrice(course.price)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;