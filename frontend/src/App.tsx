import { lazy, type Component, createResource, ErrorBoundary, Show, For } from "solid-js";
import { Route, Routes } from "@solidjs/router";
import { client, getErrorString, config, notificationStore } from ".";
import { A } from "@solidjs/router";

export function GifViewData({ params }) {
    const fetchGif = async () => {
        return await client.getGif(params.id);
    };
    const [gif] = createResource(() => params.id, fetchGif);
    return gif;
}

const App: Component = () => {
    return (
        <>
            <div class="navbar">
                <div class="navbar-content">
                    <span class="site-name">
                        <A href="/" class="link">
                            kitties!!
                        </A>
                    </span>
                    <ul class="navbar-links">
                        <li>
                            <Show when={config.token == null}>
                                <A href="/login" class="button">
                                    Login
                                </A>{" "}
                                or{" "}
                                <A href="/signup" class="button">
                                    Signup
                                </A>
                            </Show>
                            <Show when={config.token != null}>
                                <Show when={notificationStore()?.count}>
                                    <A href="/notifications" class="button">
                                        Notifications ({notificationStore().count})
                                    </A>
                                </Show>
                                <A href="/gifs/post" class="button">
                                    Post
                                </A>
                                <A href="/resetPassword" class="button">
                                    Reset Password
                                </A>
                                <A href="/logout" class="button">
                                    Log out
                                </A>
                            </Show>
                            <A href="/settings" class="button">
                                Settings
                            </A>
                            <Show when={config.token != null}>
                                <br />
                            </Show>
                        </li>
                    </ul>
                </div>
            </div>
            <ErrorBoundary
                fallback={e => {
                    console.error(e);
                    return (
                        <div class="content">
                            <div class="content-header">
                                <h2>Page failed to load! :(</h2>
                            </div>
                            <div class="content-content">
                                <code>{location.href}</code>
                                <div class="error">
                                    <p>{getErrorString(e)}</p>
                                </div>
                                <For each={e.stack.split("\n")}>
                                    {line => (
                                        <>
                                            <div style="font-weight: bold">
                                                {line.match(/(?<=at ).+(?= \()/)}
                                            </div>
                                            <code>{line.match(/(?<=\().+(?=\))/)}</code>
                                        </>
                                    )}
                                </For>
                            </div>
                        </div>
                    );
                }}
            >
                <div class="content">
                    <Routes>
                        <Route path="/" component={lazy(() => import("./pages/IndexPage"))} />
                        <Route path="/popup" component={lazy(() => import("./pages/PopupPage"))} />
                        <Route
                            path="/gifs/:id"
                            data={GifViewData}
                            component={lazy(() => import("./pages/gifs/GifPage"))}
                        />
                        <Route
                            path="/gifs/:id/edit"
                            data={GifViewData}
                            component={lazy(() => import("./pages/gifs/EditGifPage"))}
                        />
                        <Route
                            path="/gifs/:id/edit/suggest"
                            data={GifViewData}
                            component={lazy(() => import("./pages/gifs/SuggestEditGifPage"))}
                        />
                        <Route
                            path="/gifs/post"
                            component={lazy(() => import("./pages/gifs/PostGifPage"))}
                        />
                        <Route path="/login" component={lazy(() => import("./pages/LoginPage"))} />
                        <Route
                            path="/logout"
                            component={lazy(() => import("./pages/LogoutPage"))}
                        />
                        <Route
                            path="/signup"
                            component={lazy(() => import("./pages/SignupPage"))}
                        />
                        <Route
                            path="/resetPassword"
                            component={lazy(() => import("./pages/ResetPasswordPage"))}
                        />
                        <Route
                            path="/settings"
                            component={lazy(() => import("./pages/SettingsPage"))}
                        />
                        <Route
                            path="/settings/accountDeletion"
                            component={lazy(() => import("./pages/AccountDeletionPage"))}
                        />
                        <Route path="/legal">
                            <Route
                                path="/privacy"
                                component={lazy(() => import("./pages/legal/PrivacyPage"))}
                            />
                            <Route
                                path="/terms"
                                component={lazy(() => import("./pages/legal/TermsPage"))}
                            />
                        </Route>
                        <Route path="/notifications" component={lazy(() => import("./pages/NotificationsPage"))} />
                    </Routes>
                    <div class="is-center">
                        <span>
                            The kittygifs project, available on{" "}
                            <a
                                href="https://github.com/Jan0660/kittygifs"
                                target="_blank"
                                class="link"
                            >
                                GitHub
                            </a>
                            . Licensed under{" "}
                            <a
                                href="https://www.gnu.org/licenses/agpl-3.0.en.html"
                                target="_blank"
                                class="link"
                            >
                                the GNU AGPLv3
                            </a>
                            .
                        </span>
                        <br />
                        <span>
                            <a href="/legal/privacy" class="link">
                                Privacy Policy
                            </a>{" | "}
                            <a href="/legal/terms" class="link">
                                Terms of Service
                            </a>
                        </span>
                    </div>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default App;
