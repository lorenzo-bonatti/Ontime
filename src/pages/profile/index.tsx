import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Auth } from "aws-amplify";
import { useStoreDispatch } from "../../store";
import { showFeedback } from "../../store/feedback";
import { DialogUtility } from '@syncfusion/ej2-popups';
import { content } from "@syncfusion/ej2-react-grids";
import { DialogComponent } from "@syncfusion/ej2-react-popups";

export const Profile = (): ReactElement => {

    // Store
    const dispatch = useStoreDispatch();

    // State
    const [user, setUser] = useState<any | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const [viewChangePassword, setViewChangePassword] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState<string | null>(null);

    /**
     * Load user data
     * 
     * Questa funzione permette di caricare i dati relativi allutente loggato
     * come nome, indirizzo email e stato della verifica email
     */
    const loadUser = useCallback(async () => {
        // Load data
        try {
            const user = await Auth.currentAuthenticatedUser({
                bypassCache: true
            });

            console.log({ user });
            // Set user
            setUser(user);
            // Set user email 
            setEmail(user?.attributes?.email || null);
        } catch (e: unknown) {
            // Log error
            console.error('loadUser', { e });
            // Feedback
            dispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si è verificato un errure durante il salvataggio.<br />Si prega di riprovare',
                    type: 'error'
                })
            )
        }
    }, []);

    // Load default
    useEffect(() => {
        loadUser().then(() => 1)
    }, [loadUser]);

    /**
     * Change name
     * 
     * @param name 
     * @returns 
     */
    const onNameChange = async (name: string) => {
        // Check if name is the same
        if (name === user?.attributes?.name) return;
        // Check if empty string
        if (!name) {
            // Show feedback
            dispatch(
                showFeedback({
                    title: 'Nome non valido',
                    content: 'Inserisci un nome all\'interno del campo',
                    type: 'warning',
                })
            )
        }
        // Update name
        try {
            const result = await Auth.updateUserAttributes(user, { name });
            // Check if success
            if (result === "SUCCESS") {
                // Feedback
                dispatch(
                    showFeedback({
                        title: 'Nome salvato',
                        type: 'success'
                    })
                )
            } else {
                // Error feedback
                dispatch(
                    showFeedback({
                        title: 'Errore richiesta',
                        content: 'Spiacenti, si è verificato un errure durante il salvataggio.<br />Si prega di riprovare',
                        type: 'error'
                    })
                )
            }
        } catch (e: unknown) {
            // Log error
            console.error('onNameChange', { e });
            // Feedback
            dispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si è verificato un errure durante il salvataggio.<br />Si prega di riprovare',
                    type: 'error'
                })
            )
        }
    }

    /**
     * Change email
     * 
     * Update user email for sign in
     */
    const changeEmail = async (email: string) => {
        // Update user email
        try {
            const result = await Auth.updateUserAttributes(user, { email });
            // Check if success
            if (result === "SUCCESS") {
                // Feedback
                dispatch(
                    showFeedback({
                        title: 'Indirizzo email salvato',
                        content: 'Controlla la tua email e inserisci il codice di verifica',
                        type: 'info'
                    })
                )
                // Update user data
                loadUser();
            }
        } catch (e: unknown) {
            // Log error
            console.error('changeEmail', { e });
            // Feedback
            dispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si è verificato un errure durante il salvataggio.<br />Si prega di riprovare',
                    type: 'error'
                })
            )
        }
    }

    /**
     * Verify email
     * 
     * Check if the email verification code is correct
     * @param e 
     */
    const verifyEmail = async (e: any) => {
        e.preventDefault();
        // Verify code
        try {
            await Auth.verifyCurrentUserAttributeSubmit('email', code || '');
            // Feedback
            dispatch(
                showFeedback({
                    title: 'indirizzo email verificato',
                    type: 'success'
                })
            )
            // Update user data
            loadUser();
        } catch (e: unknown) {
            // Log error
            console.error('verifyEmail', { e });
            // Feedback
            dispatch(
                showFeedback({
                    title: 'Errore richiesta',
                    content: 'Spiacenti, si è verificato un errure durante il salvataggio.<br />Si prega di riprovare',
                    type: 'error'
                })
            )
        }
    }

    /**
     * Confirm change email
     * 
     * @param email 
     * @returns 
     */
    const onEmailChange = async (email: string) => {
        // Check if name is the same
        if (email === user?.attributes?.email) return;
        // Check if empty string
        if (!email) {
            // Show feedback
            dispatch(
                showFeedback({
                    title: 'Indirizzo email non valido',
                    content: 'Inserisci un indirizzo email all\'interno del campo',
                    type: 'warning',
                })
            )
        }
        // Ask confirm
        DialogUtility.confirm({
            title: 'Modifica indirizzo email',
            content: `
                <p>Stai modificando il tuo indirizzo email con</p>
                <p class="underline mt-1.5 my-4">${email}</p>
                <p>Sei sicuro/a di vuoler continuare?</p>
            `,
            okButton: {
                text: 'Modifica',
                click: async function () {
                    // @TODO disable button

                    // Call update
                    await changeEmail(email);
                    // Hide dialog
                    (this as any).hide();
                }
            },
            cancelButton: {
                text: 'Annulla',
                click: function () {
                    // Reset email
                    setEmail(user?.attributes?.email || null);
                    // Hide dialog
                    (this as any).hide();
                }
            }
        })
    }

    return (
        <div className="w-96 p-2.5 space-y-5">
            <h1 className="text-xl text-primary">Profilo</h1>
            {/* Name */}
            <TextBoxComponent
                placeholder="Nome"
                floatLabelType="Auto"
                value={user?.attributes?.name}
                change={(args: any) => onNameChange(args.value)}
            />
            {/* Email */}
            <section>
                <p className="text-lg text-primary">Modifica email</p>
                <TextBoxComponent
                    type="email"
                    placeholder="Indirizzo email"
                    floatLabelType="Auto"
                    value={email as any}
                    change={(args: any) => onEmailChange(args.value)}
                />
                {/* Verification */}
                {
                    user?.attributes?.email_verified
                        ? <div className="mt-1.5">
                            <p className="text-sm"><i className="fa-solid fa-circle-check text-green-500" /> Indirizzo email verificato</p>
                        </div>
                        : <div className="mt-1.5">
                            <p className="text-sm"><i className="fa-solid fa-clock text-yellow-500" /> In attesa di verifica</p>
                            {/* Verication code form */}
                            <form className="flex flex-row space-x-2.5 mt-1" onSubmit={verifyEmail}>
                                {/* Code */}
                                <TextBoxComponent
                                    placeholder="Codice di verifica"
                                    floatLabelType="Never"
                                    value={code as any}
                                    change={(args: any) => setCode(args.value)}
                                />
                                {/* Submit */}
                                <ButtonComponent
                                    type="submit"
                                    content="Invia verifica"
                                />
                            </form>
                        </div>
                }
            </section>
            {/* Change password */}
            <section>
                <p className="text-lg text-primary">Modifica password</p>
                <ButtonComponent
                    content="Modifica password"
                    isPrimary={true}
                    cssClass="e-outline w-full h-10"
                    onClick={() => setViewChangePassword(true)}
                />
            </section>
            <hr />
            {/* Danger zone */}
            <section>
                <p className="text-lg text-red-600">Eliminazione utente</p>
                <p className="text-sm">Una volta eliminato l'utente, tutti i dati saranno cancellati e non più recuperabili</p>
                <ButtonComponent
                    content="Elimina utente"
                    iconCss="fa-solid fa-trash"
                    cssClass="e-danger e-outline w-full mt-2.5"
                />
            </section>
            {/* Change password dialog */}
            <DialogComponent
                target='#app'
                width='60%'
                isModal={true}
                header='Modifica password'
                showCloseIcon={true}
                visible={viewChangePassword}
                close={() => setViewChangePassword(false)}
            >
                <form action="">
                    <p>Modifica le credenziali di accesso al portale.</p>
                    {/* Old password */}
                    <TextBoxComponent
                        placeholder="Vecchia password"
                        floatLabelType="Auto"
                        value={oldPassword as any}
                        change={(args: any) => setOldPassword(args.value)}
                    />
                    {/* New password */}
                    <TextBoxComponent
                        placeholder="Nuova password"
                        floatLabelType="Auto"
                        value={newPassword as any}
                        change={(args: any) => setNewPassword(args.value)}
                    />
                    {/* Submit */}
                    <ButtonComponent
                        type="submit"
                        content="Cambia password"
                        isPrimary={true}
                        cssClass='w-full mt-2.5'
                    />
                </form>
            </DialogComponent>
        </div>
    )
}