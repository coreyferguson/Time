
# Prompt
PROMPT=$'
┌─ %~ %{$fg[white]%}% %D{@ %H:%M:%S} $(git_prompt_info)\
└─ $ '

# Git indicators
ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg[white]%}git(%{$fg_bold[white]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg_bold[red]%}*%{$reset_color%}%{$fg[white]%})"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$reset_color%}%{$fg[white]%})"
