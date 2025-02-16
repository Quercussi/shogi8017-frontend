import { toast } from 'sonner';
import {ServerActionError, ServerActionResult} from "@/utils/action";

export async function handleWithToast<Result>(
    action: () => Promise<ServerActionResult<Result> | void>,
    messages: { loading: string; success: string; error: (err: Error) => string }
) {
    return toast.promise(
        new Promise<void>(async (resolve, reject) => {
            try {
                const result = await action();

                if (result && 'success' in result) {
                    if (result.success) {
                        resolve();
                    } else {
                        reject(new ServerActionError(result.error));
                    }
                } else {
                    resolve();
                }
            } catch (error) {
                reject(error instanceof Error ? error : new Error('Unexpected error occurred'));
            }
        }),
        messages
    );
}
