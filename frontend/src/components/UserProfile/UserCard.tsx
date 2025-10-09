
import { CalenderIcon } from "../../icons";
import formatReadableDate from "../../utils/formateDate";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface UserCardProps {
  title: any;
  date: any;
  plan: any;
  buttonText: any;
  placeButton: boolean;
  clickFunction: any;
  reasons?: string[];
  city?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  title,
  date,
  plan,
  buttonText,
  placeButton,
  clickFunction,
  reasons = [],
  city,
}) => {
  return (
    <div className="relative h-full p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex justify-between">
        <div className="w-full">
          <h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
              <CalenderIcon />
              {formatReadableDate(date)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400">
              {plan}
            </span>
            {city && (
              <span className="inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400"> {city} </span>
            )}
          </div>
          {reasons.length > 0 && (<>
            <div className="mt-4"> Reasons:</div>
            <div className="flex flex-col">
              {reasons.map((reason, index) => (
                <Badge key={index} >
                  {reason}
                </Badge>
              ))}
            </div>
          </>)}

        </div>


        {placeButton && (
          <div className="self-start mt-0">
            <Button size="sm" onClick={clickFunction}>
              <span className="text-xs text-nowrap">{buttonText}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
