import { Eye, EyeOff } from "lucide-react";

const ShowPasswordButton = ({ show, setShow }) => {
    return <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
    >
        {show ? (
            <EyeOff className="h-4 w-4" />
        ) : (
            <Eye className="h-4 w-4" />
        )}
    </button>
}

export default ShowPasswordButton;