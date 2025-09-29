helm repo add gitlab https://charts.gitlab.io
helm repo update
helm upgrade --install rodaai gitlab/gitlab-agent \
    --namespace gitlab-agent-rodaai \
    --create-namespace \
    --set config.token=glagent-gpRT8m8iENz8qRzLWz8q5X84xvuxa4js6s_iGHsnzXgutsZHVA \
    --set config.kasAddress=wss://kas.gitlab.com
